import React, { useState } from 'react';
import { Check, Sparkles, Zap } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import ParticleBackground from '../../components/ParticleBackground';
import './SubscriptionPage.css';

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  limits: {
    searches: number;
    notes: number;
  };
  popular?: boolean;
  stripeLink: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started with AI-powered learning',
    features: [
      'Basic concept explanations',
      'Standard search results',
      'Basic note organization',
      'Community support'
    ],
    limits: {
      searches: 10,
      notes: 10
    },
    stripeLink: 'https://buy.stripe.com/14kg0Zf932zq92w6oo'
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$6.99',
    description: 'Enhanced features for dedicated learners',
    features: [
      'Advanced concept breakdowns',
      'Priority search results',
      'Advanced note organization',
      'Email support',
      'Custom learning paths',
      'Progress tracking'
    ],
    limits: {
      searches: 40,
      notes: 50
    },
    popular: true,
    stripeLink: 'https://buy.stripe.com/14kg0Zf932zq92w6oo'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$14.99',
    description: 'Ultimate learning experience for professionals',
    features: [
      'Expert-level explanations',
      'Unlimited search priority',
      'Advanced note system',
      'Priority support',
      'Custom learning paths',
      'Progress tracking',
      'AI study recommendations',
      'Offline access'
    ],
    limits: {
      searches: 100,
      notes: 100
    },
    stripeLink: 'https://buy.stripe.com/14kg0Zf932zq92w6oo'
  }
];

const Desktop = () => {
  const [billingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const [selectedStripeLink, setSelectedStripeLink] = useState('');

  const handleSubscribe = (stripeLink: string) => {
    setSelectedStripeLink(stripeLink);
    setShowStripeCheckout(true);
  };

  if (showStripeCheckout) {
    return (
      <MainLayout>
        <div className="stripe-checkout-container">
          <iframe
            src={selectedStripeLink}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Stripe Checkout"
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="subscription-container">
        <div className="subscription-header">
          <h1 className="page-title">Choose Your Plan</h1>
          <p className="pricing-note">*All prices shown are placeholder values for demonstration purposes</p>
        </div>

        <div className="subscription-content">
          <ParticleBackground />
          
          <div className="plans-container">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`plan-card ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && (
                  <div className="popular-badge">
                    <Sparkles size={14} />
                    Most Popular
                  </div>
                )}
                
                <div className="plan-header">
                  <h2 className="plan-name">
                    {plan.id === 'pro' ? <Zap className="plan-icon" size={20} /> : null}
                    {plan.name}
                  </h2>
                  <div className="plan-price">
                    <span className="amount">{plan.price}</span>
                    <span className="period">/ month</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="plan-limits">
                  <div className="limit-item">
                    <span className="limit-value">{plan.limits.searches}</span>
                    <span className="limit-label">Deep Searches</span>
                  </div>
                  <div className="limit-item">
                    <span className="limit-value">{plan.limits.notes}</span>
                    <span className="limit-label">Notes</span>
                  </div>
                </div>

                <div className="plan-features">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <Check size={16} className="feature-check" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className={`subscribe-button ${plan.popular ? 'popular' : ''}`}
                  onClick={() => handleSubscribe(plan.stripeLink)}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

          <div className="subscription-footer">
            <p className="guarantee">30-day money-back guarantee • Cancel anytime</p>
            <p className="support">Need help choosing? Contact our support team</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Desktop;