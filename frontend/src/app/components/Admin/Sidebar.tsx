import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">SKILL HUB</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/admin" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/transactions" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
              Transactions
            </Link>
          </li>
          <li>
            <Link href="/admin/reviews" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
              Reviews
            </Link>
          </li>
          <li>
            <Link href="/admin/collections" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
              Collections
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
              Users
            </Link>
          </li>
          <li>
            <Link href="/admin/items" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
              Items
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
