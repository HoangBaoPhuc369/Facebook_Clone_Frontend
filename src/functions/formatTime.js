import moment from "moment";

export function formatTime(time) {
  const now = moment();
  const timestamp = moment(time);
  const diff = now.diff(timestamp, "seconds");

  if (diff < 60) {
    return `${diff}s`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}m`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h`;
  } else if (diff < 604800) {
    return `${Math.floor(diff / 86400)}d`;
  } else if (diff < 31449600) {
    return `${Math.floor(diff / 604800)}w`;
  } else {
    return `${Math.floor(diff / 31449600)}y`;
  }
}

export function formatTimePost(time) {
  const timestamp = moment(time);
  const currentYear = moment().year();
  const year = timestamp.year();

  if (year === currentYear) {
    return timestamp.format("MMM D [at] hh:mm A");
  } else {
    return timestamp.format("MMM D, YYYY");
  }
}

export function formatTimeOrPost(time) {
  const now = moment();
  const timestamp = moment(time);
  const diff = now.diff(timestamp, "days");

  if (diff <= 7) {
    return formatTime(time);
  } else {
    return formatTimePost(time);
  }
}
