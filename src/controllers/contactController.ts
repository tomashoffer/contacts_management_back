import { Request, Response } from 'express';
import Contact from '../models/contacts.model';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();


export async function getContacts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const contacts = await Contact.findAndCountAll({
      limit,
      offset,
    });

    res.status(200).json({
      total: contacts.count,
      contacts: contacts.rows,
    });
  } catch (error) {
    console.error('Error when obtaining the list of contacts', error);
    res.status(500).json({ error: 'Error in obtaining the contact list' });
  }
}


export async function createContact(req: Request, res: Response) {
  try {
    const { name, address, email, phone, photo, profession } = req.body;

    const newContact = await Contact.create({
      name,
      address,
      email,
      phone,
      photo,
      profession
    });

    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating the contact:', error);
    res.status(500).json({ error: 'Error creating the contact:' });
  }
}

export async function updateContact(req: Request, res: Response) {
  try {
    const { contactId } = req.params;
    const { name, address, email, phone, photo, profession } = req.body;

    const existingContact = await Contact.findByPk(contactId);
    if (!existingContact) {
      return res.status(404).json({ error: 'Contact does not exist' });
    }

    existingContact.name = name;
    existingContact.address = address;
    existingContact.email = email;
    existingContact.phone = phone;
    existingContact.photo = photo;
    existingContact.profession = profession;

    const user = await existingContact.save();

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error updating the contact:', error);
    res.status(500).json({ error: 'Error updating contact' });
  }
}

export const searchContactsByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (!name) {
      return [];
    }

    const contacts = await Contact.findAll({
      where: {
        name: { [Op.iLike]: `%${name}%` }
      }
    });

    if (!contacts.length) {
      return res.status(404).json({ message: "No contacts found with the provided name." });
    }

    res.status(200).json({ contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getContactById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Missing id parameter." });
    }

    const contact = await Contact.findOne({
      where: {
       id
      }
    });

    if (!contact) {
      return res.status(404).json({ message: "No contact found with the provided id." });
    }

    return res.status(200).json(contact); // Devolver directamente el objeto contact
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
