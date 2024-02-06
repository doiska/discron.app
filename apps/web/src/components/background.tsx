export function Background({ background }: { background?: string }) {

    if(!background) {
        return (
            <div className="absolute inset-0 bg-gradient-to-br from-black to-zinc-950 -z-10">
                <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
                <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
            </div>
        )
    }


    return (
        <div
            className="absolute inset-0 bg-cover bg-center -z-10"
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-black to-transparent backdrop-filter backdrop-blur-sm" />
        </div>
    )
}
