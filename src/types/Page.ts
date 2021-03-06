import User from "types/User";

type Page = {
  path: string;
  label: string;
  icon?: React.ReactElement;
  visible?: (user: User | undefined, online: boolean) => boolean;
};

export default Page;
