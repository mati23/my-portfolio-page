import ExperienceIconComponent from "../ExperienceIconComponent"

import styles from "./styles.module.css"
import "./styles.module.css"

const ExperienceComponent = () => {
	return (
		<div className={styles.container}>
			<h1>Professional Experience</h1>

			<div className={styles.experienceContent}>
				<h2>VTEX</h2>
				<div className={styles.experienceDescription}>
					<h3>Software Engineer II</h3>
					<ul>
						<li>
							Working as a software engineer with several experienced programmers.
							I work with C# and .NET platform for back-end development. 
						</li>
						<li>
							Development for legacy and modern applications, migrating monolith systems 
							to several microservice applications.
						</li>
						<li>
							Continued to use AWS but also had first contact with several other tools for CI/CD and
							observability.
						</li>
						<li>
							I'm making heavy use of Domain Driven Design to improve the systems organization. 
						</li>
					</ul>
				</div>
			</div>

			<div className={styles.experienceContent}>
				<h2>Instituto Atlântico</h2>
				<div className={styles.experienceDescription}>
					<h3>Software Engineer II</h3>
					<ul>
						<li>
							Working as software engineer in a Hewlett-Packard Enterprise
							project, using the most recent technologies for serverless
							applications and microservices, focusing on the development of
							Lambda Functions using Java for a full back-end application;
						</li>
						<li>
							Deployment of services following CI/CD practices and Azure
							DevOps as main tool;
						</li>
						<li>
							Acted as Scrum Master when our SM was on vacation or on day-off;
						</li>
						<li>
							Participated on the AWS Partnership Team bringing new clients to
							Instituto Atlantico using AWS solutions
						</li>
					</ul>
				</div>
			</div>

			<div className={styles.experienceContent}>
				<h2>Logique Sistemas</h2>
				<div className={styles.experienceDescription}>
					<h3>Software Engineer I</h3>
					<div className="experience-description">
						<ol>
							<li>
								Helped developing a gas distribution system for Copergas
								company, which belongs to Mitsui & Co. Ltd.;
							</li>
							<li>
								Work in the back-end and front-end using mainly Java and
								JavaScript and both new and legacy frameworks;
							</li>
							<li>Used Oracle relational database;</li>
							<li>
								Also helped another team to develop a food delivery application
								using React.
							</li>
						</ol>
					</div>
				</div>
			</div>

			<div className={styles.experienceContent}>
				<h2>MagniFinance</h2>
				<div className={styles.experienceDescription}>
					<h3>Full Stack Developer</h3>
					<div className="experience-description">
						<ol>
							<li>
								Worked on a fintech startup focused on emiting invoices in the
								country of Portugal, which one of the greatest clients were
								Uber;
							</li>
							<li>
								Migrated to a new front-end system using Angular.js;
							</li>
							<li>
								After a few months I started to get back-end tasks using C# with
								.NET framework.
							</li>
						</ol>
					</div>
				</div>
			</div>

			<div className={styles.experienceContent}>
				<h2 className="button-gradient experience-button-polygon">3E Engineering</h2>
				<div className={styles.experienceDescription}>
					<h3>Full Stack Developer</h3>
					<div className="experience-description">
						<ol>
							<li>
								Worked in the back-end and front-end of a electrical power
								distribution system using PHP and Vue.js along with NoSQL
								databases like MongoDB;
							</li>
						</ol>
					</div>
				</div>

			</div>

			<h1>Education</h1>

			<div className={styles.educationContent}>
				<h2>Universidade Federal do Ceará</h2>

				<div className={styles.experienceDescription}>
					<h3>Computer Engineering</h3>
					<div className="experience-description">
						<ul>
							<li>
								Started learning the basics of every engineering course with classes like Calculus, Physics, Linear Algebrar, etc;
							</li>
							<li>
								After the Programming classes, I developed the interest in the area more than automation or telecommunications
							</li>
							<li>
								Focused my strand in Software Development and graduated developing a paper about an app for 3D Reconstruction alongside with a web server.
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className={styles.educationContent}>
				<h2>Certificates</h2>

				<div className={styles.experienceDescription}>
					<ul>
						<li>
							<b>AWS Partner: Accreditation (Technical)</b> <br />
							Amazon Web Services
						</li>
						<li>
							<b>AWS Certified Developer - Associate</b> <br />
							Amazon Web Services
						</li>
						<li>
							<b>Ultimate AWS Certified Developer Associate 2022</b> <br />
							Stephane Maarek - Udemy
						</li>
						<li>
							<b>AWS Certified Developer Associate Exam Training DVA-C01</b> <br />
							Neal Davis - Udemy
						</li>
						<li>
							<b>Complete Agile Scrum Master Certification Training</b> <br />
							Mirko Perkusich, Ph.D. - Udemy
						</li>
						<li>
							<b>Unit Tests in JAVA: Dominate JUnit, Mockito and TDD</b> <br />
							Francisco Wagner Costa Aquino - Udemy
						</li>
						<li>
							<b>Linux Foundation Certified Systems Administrator Course</b> <br />
							Aaron Lockhart, Kodekloud - Udemy
						</li>
					</ul>
				</div>
			</div>

			<h1>Additional Skills</h1>
			<div className={styles.techIcons}>
				<ExperienceIconComponent entityName="Lambda" />
				<ExperienceIconComponent entityName="CloudWatch" />
				<ExperienceIconComponent entityName="Dynamo" />
				<ExperienceIconComponent entityName="S3" />
				<ExperienceIconComponent entityName="Git" />
				<ExperienceIconComponent entityName="Hibernate" />
				<ExperienceIconComponent entityName="MySQL" />
				<ExperienceIconComponent entityName="React" />
				<ExperienceIconComponent entityName="Reltio" />
				<ExperienceIconComponent entityName="Azure" />
				<ExperienceIconComponent entityName="Design-Patterns" />
				<ExperienceIconComponent entityName="DDD" />
				<ExperienceIconComponent entityName="DotNet" />
				<ExperienceIconComponent entityName="Grafana" />
			</div>
		</div>
	)
}

export default ExperienceComponent
