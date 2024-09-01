# react-ts-node-simple-duty-app
<a name="readme-top"></a>

<!-- PROJECT INFO -->
<br />
<div align="center">

<h3 align="center">Simple Duty List Application</h3>

  <p align="center">
  A simple CRUD web application based on Node.js and React Typescript with antd, test with Jest.
  </p>
</div>


<!-- PROJECT PREVIEW -->
## Project Preview

![Application Screen Shot][application-screenshot]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React.js]][React-url]
* [![PostgreSQL Database][PostgreSQL]][PostgreSQL-url]
* [![Node.js][Node-js]][Node-js-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Setup locally

This project can be opened using docker-compose up under default directory.

### Prerequisites

* Docker

The following ports will be used:

* database: 5432
* backend: 3000
* frontend: 5173

### Installation

1. Install Docker/Docker Desktop (https://docs.docker.com/engine/install/)
  
2. Clone the repo
   ```sh
   git clone https://github.com/jlimyt/react-ts-node-simple-duty-app.git
   ```

3. In command prompt, navigate to the folder, execute the following command:

   ```sh
   docker-compose up
   ```
4. It takes some time to initialize the database, on success it should shows the following in command prompt:

  ![Start Docker Success][success-screenshot]

5. Open browser and navigate to localhost:5173, on success it should shows:

  ![Landing Page][landing-screenshot]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Jack Lim - ytljack0261@gmail.com

[![Linked-in][linkedin-shield]][linkedin-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/jack-lim-7a60a620b/

[application-screenshot]: screenshot/default-cover.jpg
[success-screenshot]: screenshot/docker-success.jpg
[landing-screenshot]: screenshot/landing-page.jpg

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[PostgreSQL]: https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Node-js]: https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white
[Node-js-url]: https://nodejs.org/
