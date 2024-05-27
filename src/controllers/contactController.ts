// src/controllers/contactController.ts

import { Request, Response } from 'express';
import * as contactService from '../services/contactService';

export async function getContacts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const contacts = await contactService.getAllContacts(page, limit);

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
    const newContact = await contactService.createNewContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating the contact:', error);
    res.status(500).json({ error: 'Error creating the contact:' });
  }
}

export async function updateContact(req: Request, res: Response) {
  try {
    const { contactId } = req.params;
    const updatedContact = await contactService.updateContactById(contactId, req.body);
    res.status(200).json({ updatedContact });
  } catch (error) {
    console.error('Error updating the contact:', error);
    res.status(500).json({ error: 'Error updating contact' });
  }
}

export async function searchContactsByName(req: Request, res: Response) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Name parameter is required' });
    }
    const contacts = await contactService.searchContactsByName(name.toString());
    res.status(200).json({ contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getContactById(req: Request, res: Response) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Id parameter is required' });
    }
    const contact = await contactService.getContactById(id.toString());
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
