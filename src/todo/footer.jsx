import '../assets/styles/footer.styl'
export default {
  data() {
     return {
         author:'fengliyang'
     }
  },
  render() {
    return (
        <div id="footer" style="text-align:center;color:red">
           <span>written by {this.author}</span>
        </div>
    )
  }
}
