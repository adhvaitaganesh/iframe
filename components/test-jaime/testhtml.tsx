import React from 'react';
import styles from './SignIn.module.css';
import { MrkdLogo } from '../icon';

const SignIn = () => {
  return (

    <div className={styles.container}>
      <div className={styles.signinBox}>
        <h1>Welcome Back</h1>
        {MrkdLogo()}
        <div>Please sign in to continue</div>
        <button className={`${styles.signinBtn} ${styles.google}`}>Sign in with Google</button>
        <button className={`${styles.signinBtn} ${styles.email}`}>Sign in with Email</button>
        <button className={`${styles.signinBtn} ${styles.facebook}`}>Sign in with Facebook</button>
        <button className={`${styles.signinBtn} ${styles.twitter}`}>Sign in with Twitter</button>
      </div>
    </div>
  );
}

export default SignIn;
