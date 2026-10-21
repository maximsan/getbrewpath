import { notFound } from 'next/navigation';

/** Any address no page claims shows the designed 404 in the visitor's language. */
export default function UnknownPage() {
  notFound();
}
