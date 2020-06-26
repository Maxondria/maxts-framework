import Eventing from "./Eventing";
import Sync from "./Sync";

export interface UserProps {
  id?: number;
  name?: string;
  age?: number;
}

const baseURL = "http://localhost:3004/users";

export default class User {
  public events: Eventing = new Eventing();
  public sync: Sync<UserProps> = new Sync<UserProps>(baseURL);


}
