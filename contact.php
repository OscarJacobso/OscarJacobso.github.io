<?php
if(isset($_POST['Submit'])) {
  $mailto = "oscareglejacobson@gmail.com";

  $name = $_POST['name'];
  $fromEmail = $_POST['email'];
  $subject = $_POST['subject'];
  // $subject2 = "Confirmation: Message was submitted successfully | Oscar Jacobson;";
  
  $message = "Visitor name: " . $name . "\n"
  . "From Email: " . $fromEmail . "\n\n"
  . "Visitor message: " . "\n" . $_POST['message'];

  // $message2 = "Hey " . $name . "!\n"
  // . "Thank you for contacting me! I will get back to you shortly!" . "\n\n"
  // . "Regards, " . "\n" . "-Oscar Jacobson";

  $header = "From: " . $fromEmail;
  // $header2 = "From " . $mailto;

  mail($mailto, $subject, $message, $header);
  // mail($fromEmail, $subject2, $message2, $header2);
}
?>


<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Contact Me</title>
	<link rel="stylesheet" type="text/css" href="style3.css">
</head>

<div class="inv">
  <header class="inline">
    <h2 style="margin-top: 2rem;">Contact</h2>
  </header>
</div>

<nav>
  <ul>
    <li><a href="0.1 Resume Page.html">Home</a></li>
    <!-- <li><a href="#">About</a></li> -->
    <li>
    <a href="about.html">
      <div class="dropdown">
        <span>About <i class="dropdown-arrow"></i></span>
          <div class="dropdown-content">
            <p><a href="about.html#Education">Education</a></p>
            <p><a href="about.html#Experience">Experience</a></p>
            <p><a href="about.html#Skills">Skills</a></p>
          </div>
        </div>
      </a>
    </li>
    <li><a href="projects.html">Projects</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>

<body>
	<div class="container about" id="background" >
		<form action="#" method="POST" style="margin-right: 3rem; font-weight: 20;">
			<h2 style="font-size: 20px; margin-bottom: 1rem;">Write me</h2>
			<input type="text" placeholder="Name" id="name" name="name" required>
			<input type="email" placeholder="Email" id="email" name="email" required>
			<input type="text" placeholder="Subject" id="subject" name="subject" required>
			<textarea id="message" placeholder="Message" name="message" required></textarea>
			<input type="submit" value="Submit">
		</form>
      <div style="margin-left: 3rem;">
        <h2 style="font-size: 20px;">Contact information</h2>
      </div>
	</div>
</body>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <footer>
    <h3 style="margin-bottom: 5px;">Connect with me on social media</h3>
    <a href="https://www.linkedin.com/in/oscar-jacobson-a25541213/?locale=en_US" class="fa fa-linkedin" target="_blank" id="l"></a>
    <a href="#" class="fa fa-twitter" id="l"></a>
    <a href="https://github.com/OscarJacobso" class="fa fa-github" target="_blank" id="l"></a>
  </footer>
  <div style="height: 500px"></div>
</body>
</html>