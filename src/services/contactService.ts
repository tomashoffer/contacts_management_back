// src/services/contactService.ts

import { Op } from 'sequelize';
import Contact from '../models/contacts.model';

export async function getAllContacts(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;
  const contacts = await Contact.findAndCountAll({
    limit,
    offset,
  });
  return contacts;
}

export async function createNewContact(contactData: any) {
  const newContact = await Contact.create(contactData);
  return newContact;
}

export async function updateContactById(contactId: string, updatedData: any) {
  const existingContact = await Contact.findByPk(contactId);
  if (!existingContact) {
    throw new Error('Contact does not exist');
  }
  Object.assign(existingContact, updatedData);
  const updatedContact = await existingContact.save();
  return updatedContact;
}

export async function searchContactsByName(name: string) {
  const contacts = await Contact.findAll({
    where: {
      name: { [Op.iLike]: `%${name}%` },
    },
  });
  return contacts;
}

export async function getContactById(id: string) {
  const contact = await Contact.findOne({
    where: {
      id,
    },
  });
  if (!contact) {
    throw new Error('No contact found with the provided id');
  }
  return contact;
}
