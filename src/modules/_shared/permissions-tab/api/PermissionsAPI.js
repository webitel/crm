import APIPermissionsGetter from '../../../../app/api/PermissionsAPIService/APIPermissionsGetter';
import APIPermissionsPatcher from '../../../../app/api/PermissionsAPIService/APIPermissionsPatcher';

export default class PermissionsAPI {
  constructor(url) {
    this.url = url;
    this._permissionsGetter = new APIPermissionsGetter(url);
    this._permissionsPatcher = new APIPermissionsPatcher(url);
  }

  static getListByUrl = (url) => {
    const permissionsGetter = new APIPermissionsGetter(url);
    return (params) => permissionsGetter.getList(params);
  };

  static patchByUrl = (url) => {
    const permissionsPatcher = new APIPermissionsPatcher(url);
    return (parentId, changes) =>
      permissionsPatcher.patchItem({
        id: parentId,
        changes,
      });
  };

  getList(params) {
    return this._permissionsGetter.getList(params);
  }

  patch(parentId, changes) {
    return this._permissionsPatcher.patchItem({
      id: parentId,
      changes,
    });
  }
}
