import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CustomerAuthService } from '../services/customer-auth.service';

export const customerGuard: CanActivateFn = () => {
  const auth = inject(CustomerAuthService);
  const router = inject(Router);
  const isLoggedIn = auth.isLoggedIn();
  console.log('customerGuard: isLoggedIn =', isLoggedIn);
  if (isLoggedIn) {
    console.log('customerGuard: Access granted');
    return true;
  }
  console.log('customerGuard: Redirecting to menu-login');
  router.navigate(['/menu-login']);
  return false;
};
