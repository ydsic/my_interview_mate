import { Navigate } from 'react-router-dom';
import { useUserDataStore } from '../../store/userData';
import { isValidUUID } from '../../utils/checkUuid';

export default function CheckAdminUuid({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = useUserDataStore((state) => state.userData.admin);
  const uuid = useUserDataStore((state) => state.userData.uuid);

  if (!admin || !isValidUUID(uuid)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
