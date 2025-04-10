function checkDay(day) {
  switch (day) {
    case "Sunday": {
      return "Minggu,";
    }
    case "Monday": {
      return "Senin,";
    }
    case "Tuesday": {
      return "Selasa,";
    }
    case "Wednesday": {
      return "Rabu,";
    }
    case "Thursday": {
      return "Kamis,";
    }
    case "Friday": {
      return "Jum'at,";
    }
    case "Saturday": {
      return "Sabtu";
    }
    default: {
      return ".";
    }
  }
}

function formatDateINA(date) {
  let seperateDate = date.split(",");
  seperateDate[0] = checkDay(seperateDate[0]);
  seperateDate[1] = seperateDate[1].split(" ").reverse().join(" ");
  seperateDate[2] = seperateDate[2].split(" ")[1];

  return seperateDate.join(" ");
}

module.exports = formatDateINA;
