import React from 'react';
import './Contact.css';


const ContactForm = () => {





  return (
    <>
      <div className="main-div">
        <div className='mapStyling'>
          <h2 style={{ marginBottom: "5px", textAlign: "center" }}>Map To Our Office </h2>
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.7268342790017!2d72.54400907504233!3d23.033799979165885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84eaf57ac615%3A0x5c7498bb96b34c97!2sLalbhai%20Dalpatbhai%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1686736464817!5m2!1sen!2sin"
            width="800" height="400"

            allowfullscreen="" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade" title="myMap"
            style={{
              border: 0, marginBottom: "15px",
              marginRight: "15px"
            }}
          ></iframe>
        </div>
        <div className="contact-form" >

          <h2>Contact Us</h2>
          <form action="https://formspree.io/f/mknadjya"
            method="POST">

            <div className="form-group">

              <label htmlFor="name" >Name</label>
              <input
                type="text"
                id="name"
                name="username"
                placeholder="Enter Your Name..."
                autoComplete="off"

                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Your Email..."
                autoComplete="off"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                autoComplete="off"
                required
              ></textarea>
            </div>
            <button type="submit">Submit</button>
            
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
