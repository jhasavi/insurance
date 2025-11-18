export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Accessibility Statement</h1>
        
        <div className="max-w-4xl space-y-8">
          <section>
            <p className="text-xl text-gray-600 leading-relaxed">
              Namaste Insurance is committed to ensuring digital accessibility for people with 
              disabilities. We are continually improving the user experience for everyone and 
              applying the relevant accessibility standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. 
              These guidelines explain how to make web content more accessible for people with disabilities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
            <ul className="space-y-3 text-gray-700">
              <li>✓ <strong>Keyboard Navigation:</strong> All interactive elements accessible via keyboard</li>
              <li>✓ <strong>Screen Reader Compatible:</strong> Semantic HTML and ARIA labels</li>
              <li>✓ <strong>Color Contrast:</strong> WCAG AA compliant color ratios</li>
              <li>✓ <strong>Responsive Design:</strong> Works on all devices and screen sizes</li>
              <li>✓ <strong>Clear Language:</strong> Plain English, no unnecessary jargon</li>
              <li>✓ <strong>Form Labels:</strong> All form fields properly labeled</li>
              <li>✓ <strong>Focus Indicators:</strong> Visible focus states for navigation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Ongoing Efforts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We are continuously working to improve accessibility:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Regular accessibility audits</li>
              <li>• Testing with assistive technologies</li>
              <li>• User feedback incorporation</li>
              <li>• Third-party accessibility reviews</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Known Issues</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We are aware of the following accessibility issues and are working to address them:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• PDF policy documents may not be fully accessible (working with carriers)</li>
              <li>• Some third-party carrier sites linked from our platform may have accessibility limitations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Assistive Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our website is designed to work with:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Screen readers (JAWS, NVDA, VoiceOver)</li>
              <li>• Voice recognition software (Dragon NaturallySpeaking)</li>
              <li>• Screen magnification software (ZoomText)</li>
              <li>• Browser zoom features (up to 200%)</li>
            </ul>
          </section>

          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Feedback & Contact</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We welcome your feedback on the accessibility of our website. If you encounter 
              accessibility barriers, please let us know:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>📧 Email: accessibility@namasteinsurance.com</p>
              <p>📞 Phone: (617) 555-0100</p>
              <p>📍 Address: Namaste Insurance, Boston, MA</p>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              We will respond to your feedback within 5 business days and work to resolve any issues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Content</h2>
            <p className="text-gray-700 leading-relaxed">
              While we strive to ensure accessibility throughout our site, some content is provided 
              by third parties (insurance carriers, analytics services). We are not responsible for 
              the accessibility of third-party content but encourage our partners to maintain 
              accessibility standards.
            </p>
          </section>

          <section className="text-sm text-gray-500">
            <p>This accessibility statement was last updated on November 17, 2025.</p>
            <p className="mt-2">
              We review and update this statement regularly as we continue to improve accessibility.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
