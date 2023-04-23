import { useEffect } from "react";
import { reset } from "../reducers/chatReducer";
import { useAppDispatch } from "../hooks/hooks";
import { useDispatch, useSelector } from "react-redux";
import { getAllChat } from "../actions/chat";
import { RootState } from "../store";

const Index = () =>{
  const isAuth = useSelector((state: RootState) => state.user.isAuth)

  const dispatch = useDispatch();
  const dispathcer = useAppDispatch();

  useEffect( () => {
    dispatch(reset())
    if(isAuth) dispathcer(getAllChat())
  }, []);

  return(
    <div className="vh-100 row p-0 m-0"></div>
  )
}

export default Index;