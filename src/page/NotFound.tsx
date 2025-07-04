import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="absolute top-0 left-0 h-full w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 gap-15">
      <div className="flex flex-col justify-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        <p className="font-extrabold text-9xl"> 404 </p>
        <p className="font-extrabold text-6xl"> NotFound </p>
      </div>
      <div className="flex flex-col justify-center items-center bg-white/40 p-10 rounded-xl border border-gray-300 shadow-md gap-15">
        <p className="font-bold text-lg text-center text-gray-100">
          방문하시려던 페이지를 찾을 수 없습니다.
          <br />
          <span className="font-medium text-base">
            주소가 변경되었거나 삭제된 페이지일 수 있습니다. 메인페이지로 이동해
            다시 시도해주세요.
          </span>
        </p>
        <Link to="/" className="w-full">
          <Button className="w-full"> 메인 화면으로 돌아가기 </Button>
        </Link>
      </div>
    </div>
  );
}
