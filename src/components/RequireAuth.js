import { Navigate } from 'react-router-dom';
import { getToken } from '@/utils/auth'
function RequireAuth({ children }) {
    // 假设有某种方式检查用户是否登录，例如检查 token

    if (!getToken()) {
        return <Navigate to="/login" replace />;
    }
    console.log(children)
    return children;
}
export default RequireAuth