import TwitterIcon from "@material-ui/icons/Twitter";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";

const twitterBlue = "#1da1f2";
const whatsappGreen = "#25d366";

type ShareProps = { message: string; url?: string };

export function Twitter(props: ShareProps) {
  return (
    <a target="blank" href={twitterLink(props)}>
      <TwitterIcon style={{ color: twitterBlue }} />
    </a>
  );
}

function twitterLink({ message, url }: ShareProps) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}${
    url ? `&url=${encodeURIComponent(url)}` : ""
  }`;
}

export function WhatsApp(props: ShareProps) {
  return (
    <a target="blank" href={whatsAppLink(props)}>
      <WhatsAppIcon style={{ color: whatsappGreen }} />
    </a>
  );
}

function whatsAppLink({ message, url }: ShareProps) {
  const fullMessage = `${message}${url ? `\n\n${url}` : ""}`;

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(
    fullMessage
  )}`;
}
