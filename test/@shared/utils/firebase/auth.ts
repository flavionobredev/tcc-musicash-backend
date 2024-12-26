import axios from 'axios';

const makeRandomString = (length: number) => {
  const result = [];
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength)),
    );
  }
  return result.join('');
};

export class FirebaseAuth {
  private readonly username: string;
  private readonly password: string;
  private token: string;
  constructor(private readonly apikey: string) {
    this.username = `${makeRandomString(10).toLowerCase()}@teste.com`;
    this.password = makeRandomString(10);
  }

  public getToken() {
    return this.token;
  }

  public getUsername() {
    return this.username;
  }

  public async initWithUser() {
    const result = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apikey}`,
      {
        email: this.username,
        password: this.password,
        returnSecureToken: true,
      },
    );
    this.token = result.data.idToken;
  }

  public async removeUser() {
    await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${this.apikey}`,
      {
        idToken: this.token,
      },
    );

    this.token = '';
  }
}
