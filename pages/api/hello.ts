// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}
const persons = [{ id: 1, name: "John Doe" }]
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | string | Data[]>
) {

  switch (req.method) {
    case 'POST':
      const person = req.body;
      person.id = persons.length + 1;
      persons.push(person);
      res.status(201).json('Added successfully')
      break;
    case 'GET':

      return res.status(200).json(persons.filter(person => person !== null))
    default:
      break;
  }

}
