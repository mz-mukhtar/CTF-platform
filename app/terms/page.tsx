'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="text-primary-400 hover:underline mb-4 inline-block"
            >
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">Terms of Service & Usage Policy</h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to CyberVanguard CTF Platform. By accessing or using our platform, you agree to be bound by these Terms of Service and Usage Policy. If you do not agree with any part of these terms, you must not use our platform.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                By creating an account, participating in challenges, or using any services provided by CyberVanguard CTF Platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
              <p className="text-gray-300 leading-relaxed">
                These terms apply to all users, including but not limited to participants, administrators, and visitors to the platform.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Account Registration</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>You must provide accurate, current, and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>One account per person is allowed. Multiple accounts will result in disqualification</li>
                <li>You must be at least 13 years old to use this platform (or comply with local age requirements)</li>
              </ul>
            </section>

            {/* Code of Conduct */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Code of Conduct</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All users must adhere to the following code of conduct:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Fair Play:</strong> Compete fairly and honestly. Sharing flags, solutions, or collaborating in unauthorized ways is strictly prohibited</li>
                <li><strong>Respect:</strong> Treat all participants, administrators, and platform resources with respect</li>
                <li><strong>No Attacks:</strong> Do not attempt to attack the platform infrastructure, brute force flags, or disrupt services</li>
                <li><strong>No Malicious Activity:</strong> Any attempts to disrupt the platform, attack other participants, or engage in malicious activities will result in immediate disqualification and potential legal action</li>
                <li><strong>Academic Integrity:</strong> If participating in an educational context, maintain academic integrity standards</li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Prohibited Activities</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                The following activities are strictly prohibited:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Sharing flags, solutions, or hints with other participants</li>
                <li>Creating multiple accounts to gain unfair advantages</li>
                <li>Attempting to hack, exploit, or attack the platform infrastructure</li>
                <li>Brute forcing flags or using automated tools to solve challenges</li>
                <li>Reverse engineering or attempting to extract challenge data</li>
                <li>Impersonating other users or administrators</li>
                <li>Posting malicious content, spam, or inappropriate material</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All content on the CyberVanguard CTF Platform, including but not limited to challenges, flags, code, designs, and documentation, is the property of CyberVanguard or its licensors.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>You may not reproduce, distribute, or create derivative works without explicit permission</li>
                <li>Challenge solutions and write-ups may be shared for educational purposes with proper attribution</li>
                <li>All rights not expressly granted are reserved</li>
              </ul>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Privacy and Data Protection</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We are committed to protecting your privacy:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>We collect and store account information, challenge submissions, and platform usage data</li>
                <li>Your email address will be used for account management and important notifications</li>
                <li>We do not share your personal information with third parties without consent</li>
                <li>All flags are stored using cryptographic hashing for security</li>
                <li>You may request deletion of your account and associated data at any time</li>
                <li>We implement security measures to protect your data, but cannot guarantee absolute security</li>
              </ul>
            </section>

            {/* Disqualification and Termination */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Disqualification and Account Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right to disqualify participants or terminate accounts for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Violation of these terms of service</li>
                <li>Cheating, sharing flags, or unfair play</li>
                <li>Creating multiple accounts</li>
                <li>Attacking the platform or other participants</li>
                <li>Any behavior deemed inappropriate or harmful</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                Disqualified users will have their scores reset and may be permanently banned from the platform.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                The CyberVanguard CTF Platform is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages, losses, or issues arising from:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-4">
                <li>Platform downtime or technical issues</li>
                <li>Loss of data or account access</li>
                <li>Disqualification or score adjustments</li>
                <li>Third-party actions or security breaches</li>
                <li>Any indirect, incidental, or consequential damages</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these terms at any time. Material changes will be communicated through the platform or via email. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions about these terms or need to report violations, please contact:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-300">
                  <strong className="text-white">CyberVanguard CTF Platform</strong><br />
                  Cyber Club @AAU<br />
                  Email: ctf@cybervanguard.club.et
                </p>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm italic">
                By using the CyberVanguard CTF Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and Usage Policy.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/register"
              className="text-primary-400 hover:underline"
            >
              Return to Registration
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

