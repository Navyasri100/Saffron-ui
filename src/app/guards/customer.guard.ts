import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CustomerAuthService } from '../services/customer-auth.service';

export const customerGuard: CanActivateFn = () => {
  const auth = inject(CustomerAuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/menu-login']);
  return false;
};
