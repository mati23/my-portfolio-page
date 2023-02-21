import React, { useState } from "react";
import ExperienceIconComponent from "../../ExperienceIconComponent/ExperienceIconComponent";
import IconComponent from "../../IconComponent/IconComponent";
import "./experience-component.css";
const ExperienceComponent = () => {
  return (
    <div className="experience-component">
      <div className="experience-icon">
        <div className="experience-title">Professional Experience</div>
        <div className="line"></div>
      </div>

      <div className="experience-description-container">
        <div className="button-gradient experience-button-polygon">
          Instituto Atlântico
        </div>
        <div className="description-padding">
          <div className="role">Software Engineer II</div>
          <div className="experience-description">
            <ol>
              <li className="dot">
                Working as software engineer in a Hewlett-Packard Enterprise
                project, using the most recent technologies for serverless
                applications and microservices, focusing on the development of
                Lambda Functions using Java for a full back-end application;
              </li>
              <li className="dot">
                Deployment of services following CI/CD practices and Azure
                DevOps as main tool;
              </li>
              <li className="dot">
                Acted as Scrum Master when our SM was on vacation or on day-off;
              </li>
              <li className="dot">
                Participated on the AWS Partnership Team bringing new clients to
                Instituto Atlantico using AWS solutions
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="experience-description-container">
        <div className="button-gradient experience-button-polygon">Logique Sistemas</div>
        <div className="description-padding">
          <div className="role">Junior Software Engineer</div>
          <div className="experience-description">
            <ol>
              <li className="dot">
                Helped developing a gas distribution system for Copergas
                company, which belongs to Mitsui & Co. Ltd.;
              </li>
              <li className="dot">
                Work in the back-end and front-end using mainly Java and
                JavaScript and both new and legacy frameworks;
              </li>
              <li className="dot">Used Oracle relational database;</li>
              <li className="dot">
                Also helped another team to develop a food delivery application
                using React.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="experience-description-container">
        <div className="button-gradient experience-button-polygon">MagniFinance</div>
        <div className="description-padding">
          <div className="role">Full Stack Developer</div>
          <div className="experience-description">
            <ol>
              <li className="dot">
                Worked on a fintech startup focused on emiting invoices in the
                country of Portugal, which one of the greatest clients were
                Uber;
              </li>
              <li className="dot">
                Migrated to a new front-end system using Angular.js;
              </li>
              <li className="dot">
                After a few months I started to get back-end tasks using C# with
                .NET framework.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="experience-description-container">
        <div className="button-gradient experience-button-polygon">3E Engineering</div>
        <div className="description-padding">
          <div className="role">Full Stack Developer</div>
          <div className="experience-description">
            <ol>
              <li className="dot">
                Worked in the back-end and front-end of a electrical power
                distribution system using PHP and Vue.js along with NoSQL
                databases like MongoDB;
              </li>
            </ol>
          </div>
        </div>
      
      </div>
    
      <div className="experience-icon">
        <div className="experience-title">Education</div>
        <div className="line"></div>
      </div>

      <div className="experience-description-container">
        <div className="button-gradient experience-button-polygon">
          Universidade Federal do Ceará
        </div>
        <div className="description-padding">
          <div className="role">Computer Engineering</div>
          <div className="experience-description">
            <ol>
              <li className="dot">
                Started learning the basics of every engineering course with classes like Calculus, Physics, Linear Algebrar, etc;
              </li>
              <li className="dot">
                After the Programming classes, I developed the interest in the area more than automation or telecommunications
              </li>
              <li className="dot">
                Focused my strand in Software Development and graduated developing a paper about an app for 3D Reconstruction alongside with a web server.
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="experience-description-container">
        <div className="button-gradient experience-button-polygon">
          Certificates
        </div>
        <div className="description-padding">
          <div className="experience-description">
            <ol>
              <li className="dot">
              <b>AWS Partner: Accreditation (Technical) </b> <br/>
              Amazon Web Services
              </li>
              <li className="dot">
                <b>AWS Certified Developer - Associate </b> <br/>
                Amazon Web Services
              </li>
              <li className="dot">
                <b>Ultimate AWS Certified Developer Associate 2022</b> <br/>
                Stephane Maarek - Udemy
              </li>
              <li className="dot">
                <b>AWS Certified Developer Associate Exam Training DVA-C01</b> <br/>
                Neal Davis - Udemy
              </li>
              <li className="dot">
                <b>Complete Agile Scrum Master Certification Training</b> <br/>
                Mirko Perkusich, Ph.D. - Udemy
              </li>
              <li className="dot">
                <b>Unit Tests in JAVA: Dominate JUnit, Mockito and TDD</b> <br/>
                Francisco Wagner Costa Aquino - Udemy
              </li>
              <li className="dot">
                <b>Linux Foundation Certified Systems Administrator Course</b> <br/>
                Aaron Lockhart, Kodekloud - Udemy
              </li>

            </ol>
          </div>
        </div>
      </div>

      <div className="experience-icon">
        <div className="experience-title">Additional Skills</div>
        <div className="line"></div>
      </div>
      <div className="icons-grid-container">
        <ExperienceIconComponent entityName="lambda"></ExperienceIconComponent>
        <ExperienceIconComponent entityName="cloudwatch"></ExperienceIconComponent>
        <ExperienceIconComponent entityName="dynamo"></ExperienceIconComponent>
        <ExperienceIconComponent entityName="s3"></ExperienceIconComponent>
        <ExperienceIconComponent entityName="git"></ExperienceIconComponent>
        <ExperienceIconComponent entityName="hibernate"></ExperienceIconComponent>
        <ExperienceIconComponent entityName="mysql"></ExperienceIconComponent>
        <ExperienceIconComponent entityName="react"></ExperienceIconComponent>
        <ExperienceIconComponent entityName="reltio"></ExperienceIconComponent>
        <ExperienceIconComponent entityName="azure"></ExperienceIconComponent>
        <ExperienceIconComponent entityName="design-patterns"></ExperienceIconComponent>
      </div>
    </div>
  );
};

export default ExperienceComponent;
