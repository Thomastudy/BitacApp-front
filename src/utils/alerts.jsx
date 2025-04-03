export const alertSimple = (title, html = false) => {
    Swal.fire({
      position: "top-end",
      html: html,
      title: title,
      showConfirmButton: false,
      timer: 900,
    });
  };
  export const alertIcon = (
    title,
    icon,
    timer,
    html = false,
    confirm = false
  ) => {
    Swal.fire({
      position: "top-end",
      icon: icon,
      title: title,
      html: html,
      showConfirmButton: confirm,
      timer: timer,
    });
  };
  export const alertButton = async (
    title,
    confirm = false,
    cancel = false,
    html,
    icon
  ) => {
    const result = await Swal.fire({
      icon: icon,
      showConfirmButton: confirm,
      confirmButtonColor: "#28a745",
      showCancelButton: cancel,
      cancelButtonColor: "#d33",
      title: title,
      html: html,
    });
  
    if (result.isConfirmed) {
      return true;
    }
  };
  