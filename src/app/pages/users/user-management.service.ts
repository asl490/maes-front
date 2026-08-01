import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersService } from '../../core/api/generated/api/users.service';
import { CreateUserDTO } from '../../core/api/generated/model/createUserDTO';
import { PagedResponseUserDTO } from '../../core/api/generated/model/pagedResponseUserDTO';
import { UpdateUserDTO } from '../../core/api/generated/model/updateUserDTO';
import { UserDTO } from '../../core/api/generated/model/userDTO';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly api = inject(UsersService);

  list(search: string, page: number, size: number): Observable<PagedResponseUserDTO> {
    return search.trim()
      ? this.api.userGetAllFilteredPagedByDto({ username: search.trim() }, page, size)
      : this.api.userGetAllPaged(page, size);
  }

  create(payload: CreateUserDTO): Observable<UserDTO> {
    return this.api.userCreate(payload);
  }

  update(id: number, payload: UpdateUserDTO): Observable<UserDTO> {
    return this.api.userUpdate(id, payload);
  }

  delete(id: number): Observable<unknown> {
    return this.api.userDelete(id);
  }
}
