// import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getPermissions } from '../store/selectors/authSelectors';

/**
 * Custom hook to get a permission
 * @param {string} servicePath - the unique path or the service
 * @param {string} permissionName - the permission name (there are no multiple permissions with the same name in one service)
 * @returns {bool} permission
 */
const useHasPermissions = (servicePath, permissionName) => {
  const permissions = useSelector(getPermissions);
  return !!permissions?.find((service) => service.path.toLowerCase() === servicePath.toLowerCase())?.permissions?.find((permission) => permission.name.toLowerCase() === permissionName.toLowerCase())
    ?.is_active;
};

useHasPermissions.propTypes = {
  servicePath: PropTypes.string.isRequired,
  permissionName: PropTypes.string.isRequired,
};

export default useHasPermissions;
