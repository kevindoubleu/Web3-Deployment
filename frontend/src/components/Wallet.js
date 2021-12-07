import { PropTypes } from "prop-types"; 

export default function Wallet(props) {
  const address = props.address;

  if (address) {
    return (
      <p>
        address: {address}
      </p>
    )
  } else {
    return (
      <p>please connect to metamask</p>
    )
  }
}

Wallet.propTypes = {
  address: PropTypes.string.isRequired,
}
