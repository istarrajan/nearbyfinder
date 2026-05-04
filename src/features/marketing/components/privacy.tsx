export function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: May 4, 2026</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="leading-relaxed">
                NearbyFinder ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. Please read this privacy policy carefully.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Location Information</h3>
              <p className="leading-relaxed mb-3">
                When you use our Service, we collect your precise or approximate location information to provide nearby place recommendations. This includes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>GPS coordinates from your device</li>
                <li>IP address-based location</li>
                <li>Wi-Fi access points and cell tower information</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Usage Data</h3>
              <p className="leading-relaxed mb-3">
                We automatically collect information about your interaction with our Service, including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Search queries and filters you use</li>
                <li>Places you view or interact with</li>
                <li>Device type, browser type, and operating system</li>
                <li>Pages visited and time spent on our Service</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Cookies and Tracking Technologies</h3>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="leading-relaxed mb-3">
                We use the collected information for various purposes:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>To provide and maintain our Service</li>
                <li>To show you relevant nearby places based on your location</li>
                <li>To improve and personalize your experience</li>
                <li>To analyze usage patterns and optimize our Service</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="leading-relaxed mb-3">
                We do not sell your personal information. We may share your information in the following situations:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
                <li><strong>With Your Consent:</strong> We may disclose your information for any other purpose with your consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
              <p className="leading-relaxed mb-3">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access and receive a copy of your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to or restrict processing of your information</li>
                <li>Withdraw consent for location data collection</li>
              </ul>
              <p className="leading-relaxed mt-3">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="leading-relaxed">
                Our Service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services</h2>
              <p className="leading-relaxed">
                Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
              <p className="leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Email: privacy@nearbyfinder.com</p>
                <p className="font-medium">Phone: +1 (555) 123-4567</p>
                <p className="font-medium">Address: 123 Privacy Lane, San Francisco, CA 94102</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
