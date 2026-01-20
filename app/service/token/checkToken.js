import jwt from 'jsonwebtoken';


export function isTokenExpired(exp) {
    if (!exp) {
        return true; // Coi như hết hạn nếu không có exp (hoặc không hợp lệ)
    }

    // Chuyển đổi exp từ giây sang miligiây bằng cách nhân với 1000
    const expirationTimeMs = exp * 1000;
    
    // Lấy thời gian hiện tại tính bằng miligiây
    const currentTimeMs = Date.now();

    // So sánh: Nếu thời gian hết hạn < thời gian hiện tại => Đã hết hạn
    return expirationTimeMs < currentTimeMs;
}


function isToken() {

    if (typeof window === 'undefined') {
        return false; // Nếu là Server, luôn trả về false để không lỗi
    }


    const tokenGet = localStorage.getItem('token'); 

    if(tokenGet === null || tokenGet === undefined || tokenGet === '') {
        return false; 
    }else{
        const decodedPayload = jwt.decode(tokenGet);
        
        if(decodedPayload && typeof decodedPayload === 'object' && 'exp' in decodedPayload) {
            const exp = decodedPayload.exp;
            if(isTokenExpired(exp)) {
                console.log('token het han');
                localStorage.removeItem('token');
                localStorage.removeItem('uid');
                localStorage.removeItem('name');
                window.location.href('/login');
                return false; 
            }else{
                console.log('token con han');
                return true
            }
        }
    }
}


export {isToken};