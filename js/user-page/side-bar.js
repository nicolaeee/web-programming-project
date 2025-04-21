function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    let main = document.getElementById("main");
    if (sidebar.style.left === "0px") {
      sidebar.style.left = "-250px";
      main.style.marginLeft = "0";
    } else {
      sidebar.style.left = "0px";
      main.style.marginLeft = "250px";
    }
  }