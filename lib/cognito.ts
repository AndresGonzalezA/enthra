import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
  } from "amazon-cognito-identity-js";
  
  const poolData = {
    UserPoolId: "us-east-1_7H7VPIa0F",
    ClientId: "26n7oqrpvnfm246b5sdffll6m6",
  };
  
  export const userPool = new CognitoUserPool(poolData);
  
  export function signIn(email: string, password: string): Promise<{ user: any; result?: any }> {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username: email,
        Pool: userPool,
      });
      user.signOut();
  
      const authDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
  
      user.authenticateUser(authDetails, {
        onSuccess: (result) => resolve({ user, result }),
        onFailure: (err) => reject(err),
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          user.challengeName = "NEW_PASSWORD_REQUIRED";
          resolve({ user });
          
        },        
      });
    });
  }
  