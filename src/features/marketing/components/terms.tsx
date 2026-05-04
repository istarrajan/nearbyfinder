export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: May 4, 2026</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using NearbyFinder ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
              <p className="leading-relaxed mb-3">
                NearbyFinder provides a platform to discover local businesses including hotels, restaurants, salons, and other establishments near your location. You agree to use the Service only for lawful purposes and in accordance with these Terms.
              </p>
              <p className="leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Use the Service in any way that violates any applicable law or regulation</li>
                <li>Engage in any automated use of the system, such as scraping or data mining</li>
                <li>Attempt to interfere with or disrupt the Service</li>
                <li>Use the Service to transmit any harmful or malicious code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Location Data</h2>
              <p className="leading-relaxed">
                Our Service uses your location data to provide nearby place recommendations. By using the Service, you consent to the collection and use of your location information as described in our Privacy Policy. You can disable location services at any time through your device settings, though this may limit functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Accuracy of Information</h2>
              <p className="leading-relaxed">
                While we strive to provide accurate and up-to-date information about businesses and locations, we cannot guarantee the accuracy, completeness, or reliability of any information displayed. Business hours, contact information, and other details may change without notice. We recommend verifying information directly with the business.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Links</h2>
              <p className="leading-relaxed">
                Our Service may contain links to third-party websites or services that are not owned or controlled by NearbyFinder. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="leading-relaxed">
                The Service and its original content, features, and functionality are owned by NearbyFinder and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="leading-relaxed">
                In no event shall NearbyFinder, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Email: legal@nearbyfinder.com</p>
                <p className="font-medium">Phone: +1 (555) 123-4567</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
