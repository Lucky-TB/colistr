import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              Co<span className="text-gold">Listr</span>
            </h3>
            <p className="text-sm text-gray-300">
              Connecting real estate professionals for successful co-investment opportunities.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-gold transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-gold transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-gold transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-gold transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/opportunities" className="text-gray-300 hover:text-gold transition-colors">
                  Browse Opportunities
                </Link>
              </li>
              <li>
                <Link href="/match" className="text-gray-300 hover:text-gold transition-colors">
                  Find Partners
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-gold transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-gray-300 hover:text-gold transition-colors">
                  Messages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-gold transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-gold transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-gold transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-300 hover:text-gold transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} CoListr. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with ❤️ for real estate professionals</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

