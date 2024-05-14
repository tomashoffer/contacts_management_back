import { Request, Response } from 'express';
import Contact from '../models/contacts.model';
import stream from 'stream';
import path from 'path';
import { Op } from 'sequelize';
import { google } from "googleapis";
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const KEYFILEPATH = path.join(__dirname, "../../key.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const credentials = JSON.parse(fs.readFileSync(KEYFILEPATH, 'utf8'));

if (!process.env.PRIVATE_KEY || !process.env.PRIVATE_KEY_ID) {
    throw new Error('PRIVATE_KEY and PRIVATE_KEY_ID env variables must be defined');
}

credentials.private_key_id = process.env.PRIVATE_KEY_ID;
credentials.private_key = process.env.PRIVATE_KEY;
credentials.type = process.env.TYPE;
credentials.project_id = process.env.PROJECT_ID;
credentials.client_email = process.env.CLIENT_EMAIL;
credentials.client_id = process.env.CLIENT_ID;
credentials.auth_uri = process.env.AUTH_URI;
credentials.token_uri = process.env.TOKEN_URI;
credentials.auth_provider_x509_cert_url = process.env.AUTH_PROVIDER;
credentials.client_x509_cert_url = process.env.CLIENT_CERT_URL;
credentials.universe_domain = process.env.UNIVERSE_DOMAIN;

const auth = new google.auth.GoogleAuth({
    credentials: credentials, 
    scopes: SCOPES,           
});

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
    const userId = req.user.userId;
    const { name, address, email, phone, photo, profession } = req.body;

    const newContact = await Contact.create({
      name,
      address,
      email,
      phone,
      photo,
      userId,
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
    const { contactId } = req.params; // Obtener el ID del contacto de los parámetros de la URL
    const { name, address, email, phone, photo, profession } = req.body;

    // Verificar si el contacto existe
    const existingContact = await Contact.findByPk(contactId);
    if (!existingContact) {
      return res.status(404).json({ error: 'Contact does not exist' });
    }

    // Actualizar los campos del contacto
    existingContact.name = name;
    existingContact.address = address;
    existingContact.email = email;
    existingContact.phone = phone;
    existingContact.photo = photo;
    existingContact.profession = profession;

    // Guardar los cambios en la base de datos
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
