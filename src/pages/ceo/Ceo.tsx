import CeoNavBar from "@/components/CeoNavBar";

function Ceo() {
    return (
        <div className="flex">
            <CeoNavBar />
            <main className="flex-1 p-8">
                <h1>CEO 대시보드 페이지</h1>
            </main>
        </div>
    );
}

export default Ceo;