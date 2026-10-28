import Link from "next/link";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-between pt-16 bg-white sm:hidden">
      <div className="flex flex-col px-4 py-6 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between text-lg font-medium text-black">
          <Link href="/products" onClick={onClose}>Products</Link>
          <span className="text-gray-400">›</span>
        </div>
        <div className="flex items-center justify-between text-lg font-medium text-black">
          <Link href="/about" onClick={onClose}>About</Link>
        </div>
        <div className="flex items-center justify-between text-lg font-medium text-black">
          <Link href="/contact" onClick={onClose}>Contact</Link>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-3 pb-8 bg-white">
        <Link
          href="/contact"
          className="flex-1 px-4 py-3 text-center text-sm font-medium text-black bg-white border border-gray-300 rounded-full hover:bg-gray-50"
          onClick={onClose}
        >
          Contact
        </Link>
        <Link
          href="/login"
          className="flex-1 px-4 py-3 text-center text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800"
          onClick={onClose}
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
