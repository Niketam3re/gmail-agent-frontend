import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Bot, Shield, Zap, ArrowRight, Check } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Intelligence',
    description: 'Advanced language models analyze context and generate professional email responses',
  },
  {
    icon: Mail,
    title: 'Gmail Integration',
    description: 'Seamlessly connects with your Gmail account for a native experience',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption and SOC 2 compliance keep your data safe',
  },
  {
    icon: Zap,
    title: '10x Faster Replies',
    description: 'Reduce email response time from hours to minutes with AI assistance',
  },
];

const benefits = [
  'Generate contextual email drafts in seconds',
  'Maintain your unique writing style',
  'Support for multiple languages',
  'Smart categorization and prioritization',
  'Learn from your feedback over time',
  'Works with attachments and threads',
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              Transform Your Email Experience
              <span className="block text-primary-600 mt-2">with AI Intelligence</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              Let AI handle your email responses while you focus on what matters.
              Professional, personalized, and perfectly timed replies at your fingertips.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • Free 14-day trial
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 bg-primary-300 rounded-full opacity-20 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Everything You Need for Email Excellence
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Powerful features designed to make email management effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Choose AI Email Assistant?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of professionals who save hours every week with intelligent email automation.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start">
                    <Check className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl">
                {/* Placeholder for demo video or screenshot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mail className="w-32 h-32 text-primary-600 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Email Workflow?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Start your free trial today and experience the future of email management.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/login">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Mail className="h-8 w-8 text-primary-500 mr-2" />
                <span className="text-xl font-semibold text-white">AI Email Assistant</span>
              </div>
              <p className="text-sm">
                Intelligent email management powered by advanced AI technology.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; 2024 AI Email Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}