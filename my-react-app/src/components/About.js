import React from 'react';
import { motion } from 'framer-motion';
import { Container, Typography } from '@mui/material';
import { 
  Target, 
  Eye, 
  Stethoscope, 
  Linkedin, 
  MessageCircle, 
  Globe, 
  FileText,
  Users,
  BookOpen,
  Award
} from 'lucide-react';
import './About.css';

const About = () => {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: 'Drug Interaction Checker',
      description:
        'A platform for checking drug interactions, sharing clinical insights, and supporting healthcare professionals in Uganda with safe prescribing practices.',
      about: {
        '@type': 'Thing',
        name: 'Drug Interactions, Clinical Decision Support, Healthcare Technology'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Drug Interaction Checker',
        founder: {
          '@type': 'Person',
          name: 'Farouk Jjingo',
          jobTitle: 'Medical Doctor and Full Stack Developer',
          description:
            'Farouk Jjingo, a medical doctor and full-stack developer, created this platform to enhance safe prescribing and clinical decision-making in Uganda.'
        }
      },
      keywords: [
        'drug interaction checker',
        'clinical decision support Uganda',
        'healthcare technology Uganda',
        'safe prescribing platform',
        'medical collaboration Uganda',
        'clinical research Uganda',
        'healthcare professionals Uganda',
        'drug safety Uganda',
        'medical education platform',
        'healthcare innovation Uganda',
        'clinical decision support Africa',
        'drug interaction database',
        'Uganda health technology',
        'clinical insights Uganda',
        'health research Africa',
        'Farouk Jjingo medical developer'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Farouk Jjingo',
      jobTitle: 'Medical Doctor and Full Stack Developer',
      description:
        'Farouk Jjingo is a medical doctor and full-stack developer specializing in clinical diagnostics and healthcare technology, founder of the Drug Interaction Checker.',
      worksFor: {
        '@type': 'Organization',
        name: 'Drug Interaction Checker'
      },
      url: 'https://jjingofarouk.xyz',
      sameAs: [
        'https://ug.linkedin.com/in/farouk-jjingo-0341b01a5',
        'https://wa.me/256751360385'
      ]
    }
  ];

  const contactLinks = [
    {
      href: 'https://ug.linkedin.com/in/farouk-jjingo-0341b01a5',
      Icon: Linkedin,
      label: 'LinkedIn',
      value: 'Farouk Jjingo',
      ariaLabel: 'Farouk Jjingo LinkedIn Profile for Medical and Tech Collaboration',
      title: 'Connect with Farouk Jjingo on LinkedIn for Healthcare Collaboration'
    },
    {
      href: 'https://wa.me/256751360385',
      Icon: MessageCircle,
      label: 'WhatsApp',
      value: '+256751360385',
      ariaLabel: 'Contact Farouk Jjingo via WhatsApp for Medical Research',
      title: 'WhatsApp Farouk Jjingo for Clinical Research Discussions'
    },
    {
      href: 'https://jjingofarouk.xyz',
      Icon: Globe,
      label: 'Website',
      value: 'jjingofarouk.xyz',
      ariaLabel: 'Farouk Jjingo\'s Website for Healthcare Technology Insights',
      title: 'Visit Farouk Jjingo\'s Website for Medical and Tech Projects'
    },
    {
      href: '/checker',
      Icon: FileText,
      label: 'Drug Checker',
      value: 'Check Drug Interactions',
      ariaLabel: 'Check Drug Interactions',
      title: 'Use Drug Interaction Checker'
    }
  ];

  const platformFeatures = [
    {
      Icon: Stethoscope,
      title: 'Drug Safety',
      description: 'Accurate drug interaction checking for safe prescribing'
    },
    {
      Icon: Users,
      title: 'Collaboration',
      description: 'Connect with healthcare professionals across Uganda'
    },
    {
      Icon: BookOpen,
      title: 'Education',
      description: 'Resources for drug interaction and clinical knowledge'
    },
    {
      Icon: Award,
      title: 'Research',
      description: 'Access to clinical data and drug interaction studies'
    }
  ];

  return (
    <div className="app-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="main-content"
      >
        <Container maxWidth="lg">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          


          <Typography className="intro-text">
            The Drug Interaction Checker is a cutting-edge platform designed to support <strong>healthcare professionals</strong>, <strong>medical students</strong>, and <strong>pharmacists</strong> in Uganda. It enables safe prescribing by providing accurate <strong>drug interaction checks</strong>, <strong>clinical decision support</strong>, and access to a collaborative network for <strong>healthcare innovation</strong> in <strong>East Africa</strong>.
          </Typography>

          <div className="card-grid">
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              transition={{ duration: 0.3 }}
              className="mission-card"
            >
              <div className="card-icon-wrapper">
                <Target className="card-icon" size={32} />
              </div>
              <Typography variant="h2" className="card-title">Our Mission</Typography>
              <Typography className="card-content">
                To empower <strong>healthcare professionals</strong> with a reliable <strong>drug interaction checker</strong> to ensure safe prescribing and enhance <strong>clinical decision-making</strong> in Uganda.
              </Typography>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03 }} 
              transition={{ duration: 0.3 }}
              className="vision-card"
            >
              <div className="card-icon-wrapper">
                <Eye className="card-icon" size={32} />
              </div>
              <Typography variant="h2" className="card-title">Our Vision</Typography>
              <Typography className="card-content">
                To bridge the gap in <strong>healthcare technology</strong> by providing a <strong>drug interaction platform</strong> that promotes <strong>safe prescribing</strong> and fosters <strong>clinical collaboration</strong> across <strong>Uganda</strong> and <strong>East Africa</strong>.
              </Typography>
            </motion.div>
          </div>

          <section className="features-section">
            <Typography variant="h2" className="section-title">Platform Features</Typography>
            <div className="features-grid">
              {platformFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="feature-card"
                >
                  <div className="feature-icon-wrapper">
                    <feature.Icon className="feature-icon" size={24} />
                  </div>
                  <Typography variant="h3" className="feature-title">{feature.title}</Typography>
                  <Typography className="feature-description">{feature.description}</Typography>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="founder-section">
            <Typography variant="h2" className="founder-title">
              Meet the Founder: Farouk Jjingo
            </Typography>
            <Typography className="founder-description">
              Farouk Jjingo is a visionary <strong>medical doctor</strong> and <strong>full-stack developer</strong> with expertise in <strong>clinical diagnostics</strong>, <strong>healthcare technology</strong>, and <strong>medical research</strong>. He founded the Drug Interaction Checker to enhance <strong>safe prescribing</strong>, <strong>clinical decision support</strong>, and <strong>healthcare education</strong> in Uganda.
            </Typography>
          </section>

          <section className="connect-section">
            <Typography variant="h2" className="connect-title">
              Connect for Healthcare Collaboration
            </Typography>
            
            <div className="connect-content">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img
                  src="/farouk.png"
                  alt="Farouk Jjingo, Medical Doctor and Full Stack Developer, Founder of Drug Interaction Checker"
                  loading="lazy"
                  className="founder-image"
                />
              </motion.div>
              
              <div className="connect-info">
                <Typography className="connect-description">
                  Farouk Jjingo is available for <strong>healthcare collaboration</strong>, <strong>medical research discussions</strong>, and <strong>platform feedback</strong>. Connect with him to explore <strong>drug interaction tools</strong>, <strong>healthcare technology</strong>, or <strong>clinical research opportunities</strong>:
                </Typography>
                
                <div className="contact-card">
                  <Typography variant="h3" className="contact-card-title">
                    Get in Touch
                  </Typography>
                  
                  <ul className="contact-list">
                    {contactLinks.map((link, index) => (
                      <li key={index} className="contact-item">
                        <a
                          href={link.href}
                          target={link.href.startsWith('http') ? '_blank' : undefined}
                          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="contact-link"
                          aria-label={link.ariaLabel}
                          title={link.title}
                        >
                          <span className="contact-icon">
                            <link.Icon size={24} />
                          </span>
                          <div className="contact-text">
                            <span className="contact-label">{link.label}</span>
                            <span className="contact-value">{link.value}</span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </motion.div>
    </div>
  );
};

export default About;