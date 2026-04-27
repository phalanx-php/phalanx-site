<?php

declare(strict_types=1);

namespace Phalanx\Site;

use Phalanx\Service\ServiceBundle;
use Phalanx\Service\Services;

final class PhalanxSiteBundle implements ServiceBundle
{
    public function services(Services $services, array $context): void
    {
        $services->singleton(SiteConfig::class)
            ->factory(static fn(): SiteConfig => SiteConfig::fromContext($context));
    }
}
