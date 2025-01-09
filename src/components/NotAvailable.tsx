
import { Travel } from '../api/travelService';

interface UserFormProps {
  onSubmit: (user: Travel) => void;
  initialData?: Travel;
  onClose: () => void;
}

const TravelForm: React.FC<UserFormProps> = ({  onClose }) => {

  return (
    <div className="table-container">
      <div className="overlay">
        <div className="modal">
          <form>
            <h4>This feature is still under construction, but we'll let you know as soon as it's ready.</h4>
        
            <button type="button" className="close-button" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TravelForm;