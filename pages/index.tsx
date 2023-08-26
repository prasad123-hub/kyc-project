import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";

export default function Home() {
  return (
    <>
      <Container>
        <FadeIn className="max-w-3xl mt-24 sm:mt-32">
          <h1 className="font-display text-5xl font-medium tracking-tight text-neutral-950 [text-wrap:balance] sm:text-7xl">
            Rewards-Cashbacks for paying credit card bills.
          </h1>
          <p className="mt-6 text-xl text-neutral-600">
            join 9M+ members who win rewards and cashbacks everyday. Don&apos;t
            miss out on your chance to be a part of something big – sign up
            today and unlock a universe of savings!
          </p>
          <Button invert className="mt-8">
            Complete Your KYC Today
          </Button>
        </FadeIn>
      </Container>
    </>
  );
}
