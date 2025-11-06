import React, { useState } from 'react';
import '../Aboutus.css'; 
import missionImage from '../assets/1.png'; 
import founderImage from '../assets/main.png'; 
import founderSignature from '../assets/sign.png';
import image1 from '../assets/2.jpg';

const valuesData = [
  {
    title: 'Community Focus',
    description: 'We’re building a non-competitive environment where women bond though various workshops, sponsored events, and dinner parties.',
  },
  
  {
    title: 'Leadership Development',
    description: 'Leadership doesn’t mean you have to lead a business or a class. But here, we’re committed to building confidence in women so when the time to be a leader arrives, you step up.',
  },
  
   {
    title: 'Empowerment',
    description: 'Despite the huge number of women-led startups in Kuwait, a lot of them remain underfunded. Like Maimuna, a lot haven’t had the time to find themselves personally either. This platform aims to empower you in every way you require.',
  },
  {
    title: 'Connection',
    description: 'Fostering powerful relationships by connecting seasoned leaders with aspiring members to share wisdom and accelerate career growth.',
  },

];
const testimonialsData = [
    {
        quote: "I went to one event not knowing what to expect, and left with three new friends and a business contact. It feels good to be part of something that’s both fun and meaningful.",
        author: "Sara, SEO Marketing Professional"
    },
    {
        quote: "For years I wanted to connect with other ambitious women but didn’t know where to start. This community gave me the courage to step out, share my story, and grow with others.",
        author: "Aisha, Looking for a career change"
    },
    {
        quote: "What I love most about Wom(en) Kuwait is the mix. One week it’s a casual coffee morning, the next it’s a workshop with an inspiring founder. It never feels forced, just natural.",
        author: "Layla, Small Business Owner"
    },
    {
        quote: "Thankyou for your great efforts and achievement in bringing this concepts of women together. Best part is meeting, networking, meeting new people and learning experiences from each other.",
        author: "Meena"
    },
    {
        quote: "Thankyou for this opportunity. Got to meet friends and socialise, discuss points which was good and we also learned from each other.",
        author: "SUGANDA"
    },
    {
        quote: "Loved your activities!! Loved the ladies who showed up. Would like to see more members for interactive sessions.",
        author: "MARYAM"
    }
    
];
const whyJoinData = [
    {
        title: 'Curated Events',
        text: 'Our events account for everyone’s social battery. You can hop into a casual online Sip & Share or find yourself energized as you meet up for regular yoga sessions.',
    },
    {
        title: 'Real Conversations',
        text: 'A supportive space for women in Kuwait where you can be yourself. The relationships you build here will go beyond small talk.',
    },
    {
        title: 'Local Collaborations',
        text: 'We partner with women-led businesses to bring you unique perks, discounts, and experiences that open the door for new opportunities.',
    },
    {
        title: 'Professional Growth',
        text: 'Access workshops, mentorship, and resources designed to help you thrive in your career and business ventures.',
    }
];

export default function AboutUs() {
  const [openValue, setOpenValue] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
  };

  const toggleValue = (index) => {
    if (openValue === index) {
      setOpenValue(null); // Close it if it's already open
    } else {
      setOpenValue(index); // Open the new one
    }
  };

  return (
    <div className="about-page">
      {/* --- OUR MISSION HERO SECTION --- */}
      <section className="mission-section"
        style={{ backgroundImage: `url(${missionImage})` }}
        >
          <div className="mission-hero-overlay"></div>
          <div className= "mission-hero-content">
          <h1 className="mission-title">Our Mission</h1>
          <p className="mission-description">
            We want to build a community where women can have fun while making genuine connections. 
            At Wom(en) Kuwait, you will find professional and personal support no matter what stage of life you’re in.
          </p>
          </div>
        
      </section>

      {/* --- WOMAN BEHIND THE VISION SECTION --- */}
      <section className="vision-section">
        <div className="vision-content">
          <div className="vision-text-content">
            <h2 className="vision-title">Woman Behind the Vision</h2>
            <p className="founder-bio">
              For years, my world was only about my family… until one day I asked myself: What about me?

            That one question changed everything.

            I have been living in Kuwait for more than two decades. My greatest joy has been raising my children and being fully present for my family. But when they grew up and stepped into their own busy lives, I realized it was time to rediscover myself.

            I began small — turning my love for baking into a little home business. But the real transformation came when I discovered Oxygen Mastermind.

              <br /><br />
              What I thought was just another networking group turned out to be something much bigger:
              <br></br>
               A community that gave me the courage to step forward — and gives entrepreneurs the structure to grow stronger.
              <br></br>
              A circle where accountability and motivation push you beyond your comfort zone.
              <br></br>
              A platform that opens new doors of opportunity for both personal and business growth.

              <br /><br />
              Today, I am proud to lead as the Franchise Holder of Oxygen Mastermind Kuwait. This is more than a business for me — This is a mission to create a platform where entrepreneurs can discover opportunities, challenge themselves, and grow together.
              <br></br>
              This journey is about courage. It’s about choosing myself after years of giving everything to others. And it’s about building something meaningful that goes beyond me.
              
              <br /><br />

              🌿 If my story resonates with you, I’d love to connect. Let’s grow together.
            </p>
          </div>
          {/* Container for the founder's image and caption */}
          <div className="founder-profile-container">
            <div className="vision-image-container">
              <img src={founderImage} alt="Maimuna, Founder & CEO" className="founder-image" /> 
            </div>
            <div className="founder-caption">
              <img src={founderSignature} alt="Maimuna's Signature" className="founder-signature" />
              <h3 className="founder-name">Maimuna Yusuf</h3>
              <p className="founder-role">Founder & CEO</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR TEAM SECTION --- 
      <section className="team-section">
        <h2 className="team-title">Our Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-photo-placeholder">TM</div>
            <div className="team-name">Team Member 1</div>
            <div className="team-role">Role</div>
          </div>
          <div className="team-card">
            <div className="team-photo-placeholder">TM</div>
            <div className="team-name">Team Member 2</div>
            <div className="team-role">Role</div>
          </div>
          <div className="team-card">
            <div className="team-photo-placeholder">TM</div>
            <div className="team-name">Team Member 3</div>
            <div className="team-role">Role</div>
          </div>
          <div className="team-card">
            <div className="team-photo-placeholder">TM</div>
            <div className="team-name">Team Member 4</div>
            <div className="team-role">Role</div>
          </div>
        </div>
      </section> */}
      {/* --- THREE PILLARS SECTION ---  */}
      <section className="pillars-section">
        <div className="pillars-container">
          <div className="pillar-card">
            <h3 className="pillar-title">Networking</h3>
            <p className="pillar-description">
              Networking doesn’t have to be this complicated thing. It can be something as simple as doing a makeup session at a sponsored event or chatting with each other over morning coffee. 
              We’ll be with you through every step of your journey. 
            </p>
          </div>
          <div className="pillar-card">
            <h3 className="pillar-title">Development</h3>
            <p className="pillar-description">
              This is for all the curious women who have 100+ things to learn but never enough time. Be in the same room as industry leaders and startup owners. 
              Learn from them as they shine on stage or have fun in the same painting workshop.
            </p>
          </div>
          <div className="pillar-card">
            <h3 className="pillar-title">Career</h3>
            <p className="pillar-description">
              If you’re looking for internship and career opportunities, you can browse through our listed jobs. We connect you to 
              female startup and business owners who are looking for ambitious, curious minds like yours.
            </p>
          </div>
        </div>
      </section> 
      {/* --- WHY JOIN SECTION --- */}
        <section className="why-join-section">
          <div className="why-join-container">
            <div className="why-join-image-wrapper">
              <img src={image1}alt="A member of Women Kuwait smiling" className="why-join-image" />
            </div>
            <div className="why-join-content">
              <h2 className="why-join-title">Why Join Women Kuwait?</h2>
              <div className="why-join-grid">
                {whyJoinData.map((card, index) => (
                  <div className="why-join-card" key={index}>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      {/* --- VALUES & TESTIMONIALS SPLIT SECTION --- */}
      <section className="values-testimonials-section">
        <div className="split-container">
          {/* --- OUR VALUES (LEFT SIDE) --- */}
          <div className="values-container">
            <h2 className="values-title">Our Values</h2>
            <p className="values-intro">
              Our core values centre the needs and wants of women as we go through various stages of life..
            </p>
            <div className="values-accordion">
              {valuesData.map((value, index) => (
                <div className="value-item" key={index}>
                  <button className="value-header" onClick={() => toggleValue(index)}>
                    <span className="value-item-title">{value.title}</span>
                    <span className="value-icon">{openValue === index ? '−' : '+'}</span>
                  </button>
                  <div className={`value-content ${openValue === index ? 'open' : ''}`}>
                    <p className="value-description">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* --- TESTIMONIALS (RIGHT SIDE) --- */}
          <div className="testimonials-container">
             <h2 className="testimonials-title">What Our Members Are Saying</h2>
             <div className="testimonial-card">
                <p className="testimonial-quote">"{testimonialsData[currentTestimonial].quote}"</p>
                <p className="testimonial-author">{testimonialsData[currentTestimonial].author}</p>
             </div>
             <div className="testimonial-nav">
                <button onClick={prevTestimonial} className="nav-arrow prev-arrow">‹</button>
                <div className="nav-dots">
                    {testimonialsData.map((_, index) => (
                        <span key={index} className={`dot ${currentTestimonial === index ? 'active' : ''}`}></span>
                    ))}
                </div>
                <button onClick={nextTestimonial} className="nav-arrow next-arrow">›</button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

