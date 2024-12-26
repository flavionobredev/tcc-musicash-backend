import { Controller, Get } from '@nestjs/common';

@Controller('_admin/tools')
export class ToolsController {
  constructor() {}

  @Get('google-auth')
  async googleAuth() {
    return (
      `
    <html>
      <head>
        <title>Google Auth</title>
      </head>
      <body>

        <button onclick="signInWithGoogle()">Sign in with Google</button>
        <br>
        <pre id="result"></pre>

        <script type="module">
          import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
          import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';

          const firebaseConfig = ` +
      process.env.FIREBASE_WEB_CONFIG +
      `;

          const app = initializeApp(firebaseConfig);
          const auth = getAuth(app);
          const provider = new GoogleAuthProvider();

          window.signInWithGoogle = () => {
            return new Promise((resolve, reject) => {
              signInWithPopup(auth, provider)
                .then((result) => {
                  document.getElementById('result').innerText = JSON.stringify(result.user, null, 2);
                  resolve(result);
                })
                .catch((error) => {
                  reject(error);
                });
            });
          }
        </script>
      </body>
    </html>
    
    `
    );
  }
}
