import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";
import MetaData from "../MetaData";
const About = () => {
    const visitInstagram = () => {
        window.location = "https://instagram.com";
    };

    return (
        <div className="aboutSection">
            <MetaData title={`About`} />
            <div></div>
            <div className="aboutSectionGradient"></div>
            <div className="aboutSectionContainer">
                <Typography component="h1">About Us</Typography>

                <div>
                    <div>
                        <Avatar
                            style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
                            src="https://res.cloudinary.com/djycqhiay/image/upload/v1685861398/Profile/image_qg05ss.png"
                            alt="Founder"
                        />
                        <Typography>Tushar Verma</Typography>
                        <Button onClick={visitInstagram} color="primary">
                            Visit Instagram
                        </Button>
                        <span>
                        Hello there! I'm Tushar Verma, a full-stack developer with enthusiasm and expertise who is committed to developing cutting-edge and user-friendly web applications.
                        I seek to combine the finest aspects of front-end as well as back-end technology to offer outstanding digital experiences.
                        I have a solid background in all of these areas.
                        </span>
                    </div>
                    <div className="aboutSectionContainer2">
                        <Typography component="h2">Connect Me</Typography>
                        <a
                            href="https://www.linkedin.com/in/tushar-verma-v660/"
                            target="blank"
                        >
                            <LinkedInIcon className="linkedInSvgIcon" />
                        </a>

                        <a href="https://github.com/tusharVerma14" target="blank">
                            <GitHubIcon className="githubSvgIcon" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;