import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png";

const options = {
  burgerColorHover: "#eb4034",
  logo,
  logoWidth: "20vmax",
  navColor1: "rgba(255, 255, 255, 0.5)", // Set the color to semi-transparent white
  logoHoverSize: "10px",
  logoHoverColor: "#eb4034",
  link1Text: "Home",
  link2Text: "Products",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.4vmax",
  link1Color: "rgba(35, 35, 35)", // Set the color to semi-transparent black
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#eb4034",
  link1Margin: "1.5vmax",
  link2Margin: "1.8vmax",
  profileIconUrl: "/login",
  profileIconColor: "rgba(35, 35, 35)",
  searchIconColor: "rgba(35, 35, 35)",
  cartIconColor: "rgba(35, 35, 35)",
  profileIconColorHover: "#eb4034",
  searchIconColorHover: "#eb4034",
  cartIconColorHover: "#eb4034",
  cartIconMargin: "1vmax",
  burgerColor: "white", // Set the burger color to white
};


const Header = () => {
  return <ReactNavbar {...options} />;
};

export default Header;
