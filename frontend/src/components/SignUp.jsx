import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending setup email to:', email);
    
    // Simulate an API call, then alert the user
    alert(`An email has been sent to ${email}. We will redirect you to simulate clicking the email link!`);
    
    // Redirect to the create-password page
    navigate('/create-password');
  };

  const animationStyles = `
    @keyframes floatSlow {
      0% { transform: translate(0px, 0px) scale(1); }
      50% { transform: translate(20px, -15px) scale(1.05); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    @keyframes floatReverse {
      0% { transform: translate(0px, 0px) scale(1); }
      50% { transform: translate(-15px, 15px) scale(0.95); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
  `;

  return (
    // MAIN CONTAINER
    <div 
      className="min-h-screen w-full bg-[#F4F7FC] font-sans"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '24px'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* --- BACKGROUND LAYER: Smaller Sizes & Slightly Decreased Opacity --- */}
      
      {/* Top Left Circle */}
      <div style={{
        position: 'absolute', top: '14%', left: '12%', width: '140px', height: '140px',
        backgroundColor: '#C8DAF7', borderRadius: '50%', filter: 'blur(25px)', opacity: 0.6, pointerEvents: 'none',
        animation: 'floatSlow 8s ease-in-out infinite'
      }}></div>
      
      {/* Bottom Left Soft White Circle */}
      <div style={{
        position: 'absolute', bottom: '-5%', left: '2%', width: '340px', height: '340px',
        backgroundColor: '#FFFFFF', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.5, pointerEvents: 'none',
        animation: 'floatReverse 12s ease-in-out infinite'
      }}></div>
      
      {/* Main Right Side Blue Circle (behind the card) */}
      <div style={{
        position: 'absolute', top: '22%', right: '10%', width: '310px', height: '310px',
        backgroundColor: '#CFDDF2', borderRadius: '50%', filter: 'blur(45px)', opacity: 0.65, pointerEvents: 'none',
        animation: 'floatSlow 10s ease-in-out infinite'
      }}></div>
      
      {/* Far Top Right Edge Circle */}
      <div style={{
        position: 'absolute', top: '8%', right: '0%', width: '170px', height: '170px',
        backgroundColor: '#D9E7F8', borderRadius: '50%', filter: 'blur(20px)', opacity: 0.7, pointerEvents: 'none',
        animation: 'floatReverse 7s ease-in-out infinite'
      }}></div>


      {/* --- MAIN CONTENT WRAPPER (Unchanged) --- */}
      <div 
        className="w-full max-w-6xl mx-auto"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}
      >

        {/* LEFT SIDE: Branding */}
        <div className="flex flex-col text-center lg:text-left items-center lg:items-start select-none">
          <h1 className="text-7xl md:text-8xl font-black text-[#0061FE] tracking-tight mb-4">
            Hexaware
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-medium tracking-tight">
            Learn, build, and grow with every login.
          </p>
        </div>

        {/* RIGHT SIDE: White Login Card */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div 
            className="w-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)]"
            style={{
              maxWidth: '500px',
              borderRadius: '32px',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '40px'
            }}
          >
            
            {/* Header Text Grouping */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h2 className="text-[34px] font-bold text-gray-900 tracking-tight leading-tight mb-4">
                Welcome to Hexaware
              </h2>
              <h3 className="text-base font-bold text-[#0061FE] tracking-wide uppercase">
                Let's Get Started
              </h3>
              <p className="text-sm text-gray-400 font-normal">
                Enter your email address to continue
              </p>
            </div>

            {/* Input Form Section */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Input Group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label htmlFor="email" className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                  EMAIL ADDRESS
                </label>
                
                {/* Input Container Wrapper */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                  {/* SVG Mail Icon */}
                  <span style={{ position: 'absolute', left: '18px', display: 'flex', alignItems: 'center', color: '#9ca3af', pointerEvents: 'none' }}>
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615m19.5 0A2.25 2.25 0 0 0 19.5 4.5" />
                    </svg>
                  </span>
                  
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F1F5F9] border border-transparent rounded-xl text-base text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-400 transition-all"
                    style={{
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '52px',
                      paddingRight: '16px'
                    }}
                    required 
                  />
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                className="w-full bg-[#0061FE] hover:bg-[#0052CC] text-white text-base font-semibold shadow-md shadow-blue-100 transition-all tracking-wide"
                style={{
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Continue
              </button>
            </form>

            {/* Centered Terms and Conditions Layout Block */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                textAlign: 'center',
                width: '100%'
              }}
            >
              <p className="text-[12px] text-gray-400 leading-relaxed max-w-xs">
                By continuing, you agree to our <br />
                <a href="#terms" className="font-semibold text-gray-500 hover:text-[#0061FE] hover:underline">Terms of Service</a> and <a href="#privacy" className="font-semibold text-gray-500 hover:text-[#0061FE] hover:underline">Privacy Policy</a>
              </p>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}