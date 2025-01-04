import React, { useState, useRef } from "react";
import "./Products.css"; // Optional: External CSS for styling
import ChatLayout from "./ChatLayout";

const Products = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); // State to manage chat visibility

  return (
    <div>
      {/* Top section with machine image */}
      <div className="top-section">
        <div className="machine-image">
          <img
            style={{ width: "100%", height: "auto" }}
            alt="Water Generator"
            src="/image.jpg"
          />
        </div>
      </div>

      {/* Section for AI-driven Solutions, Authentication & IoT, and Analytics */}
      <div className="features-section">
        <div className="feature">
          <h2>AI-Driven Solutions</h2>
          <p>
            Explore our AI-driven solutions designed to optimize water
            generation processes and enhance efficiency.
          </p>
          <button className="button">Learn More</button>
        </div>
        <div className="feature">
          <h2>Authentication & IoT</h2>
          <p>
            Discover our secure authentication and IoT capabilities for seamless
            control and monitoring of water generation systems.
          </p>
          <button className="button">Discover More</button>
        </div>
        <div className="feature">
          <h2>Analytics Integration</h2>
          <p>
            Integrate advanced analytics into your water generation processes
            for data-driven insights and decision-making.
          </p>
          <button className="button">Explore Analytics</button>
        </div>
      </div>

      {/* Section for Vertex AI and Cloud Spanner */}
      <div className="solutions-section">
        <div className="solution">
          <img
            style={{ width: "100%", height: "auto" }}
            alt="Vertex AI"
            src="https://cdn.hubblecontent.osi.office.net/m365content/publish/3c4bc6e4-94c1-471b-99c1-0ad6799b2e28/thumbnails/xxlarge.jpg" // Replace with actual image path
          />
          <h3>Vertex AI Integration</h3>
          <p>
            Utilize the power of Vertex AI to enhance the performance and
            intelligence of your water generation systems.
          </p>
        </div>
        <div className="solution">
          <img
            style={{ width: "100%", height: "auto" }}
            alt="Cloud Spanner"
            src="https://cdn.hubblecontent.osi.office.net/m365content/publish/1a2be08c-6def-4ea3-a95e-dc8b8c52757f/thumbnails/xxlarge.jpg" // Replace with actual image path
          />
          <h3>Cloud Spanner Database</h3>
          <p>
            Implement Cloud Spanner for a scalable and reliable database
            solution to support your water generation operations.
          </p>
        </div>
      </div>

      <ChatLayout />
    </div>
  );
};

export default Products;
