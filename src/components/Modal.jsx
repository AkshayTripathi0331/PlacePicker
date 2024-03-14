import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = function Modal({open, children , onClose}) {
  const dialog = useRef();

  //useEffect helps to synchronize prop values or state values to DOM APIs like this dialog showModal or a close method because as you learned

  //since useEffect function runs after the DOM elements renders then ref connection will be established and can be used in the dialog

  //useEffect dependencies values could be values of props or states that are used inside useEffect,in addition of that it could be any function or context values that depend on props or states

  //now as we are using dependencies that where values are changed the useEffect will run again

  useEffect(()=>{
  if(open){
    dialog.current.showModal();
  }
  else{
    dialog.current.close();
  }
  },[open]);

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;


// import { forwardRef, useImperativeHandle, useRef } from 'react';
// import { createPortal } from 'react-dom';

// const Modal = forwardRef(function Modal({ children }, ref) {
//   const dialog = useRef();

//   useImperativeHandle(ref, () => {
//     return {
//       open: () => {
//         dialog.current.showModal();
//       },
//       close: () => {
//         dialog.current.close();
//       },
//     };
//   });

//   return createPortal(
//     <dialog className="modal" ref={dialog}>
//       {children}
//     </dialog>,
//     document.getElementById('modal')
//   );
// });

// export default Modal;
